import { useEffect, useRef, useState } from "react"
import { useSocketStore, useRoomStore } from "@/entities"

type onErrorType = (message: string) => void

export const useWebRTC = (roomId: string, onError: onErrorType) => {
  const { socket } = useSocketStore()
  const { role, setRole } = useRoomStore()

  const videoSelfRef = useRef<HTMLVideoElement>(null)
  const videoRemoteRef = useRef<HTMLVideoElement>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const localStream = useRef<MediaStream | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  
  const pendingRTCConfig = useRef<boolean | null>(null)
  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([])
  const pendingOffer = useRef<RTCSessionDescriptionInit | null>(null)
  const isOfferer = useRef(false)
  const joined = useRef(false)

  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isMediaReady, setIsMediaReady] = useState(false)
  const [RTCConfig, setRTCConfig] = useState<RTCConfiguration | null>(null)

  const clearRefs = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop())
    }
    if (peerConnection.current) {
      peerConnection.current.close()
    }
    videoSelfRef.current = null
    videoRemoteRef.current = null
    peerConnection.current = null
    localStream.current = null
    dataChannelRef.current = null
    pendingIceCandidates.current = []
    pendingOffer.current = null
    joined.current = false
  }

  const getRoomCoockie = async () => {
    const response = await fetch(`/api/room`, { method: 'POST', body: JSON.stringify({ roomId }), headers: { 'Content-Type': 'application/json' } })
    const data = await response.json()
    return data
  }

  const getTurnCredentials = async (): Promise<{ iceServers: RTCIceServer[] }> => {
    const iceServers: RTCIceServer[] = []
    try {
      const roomData = await getRoomCoockie()
      const response = await fetch('/api/turn', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ roomId: roomData.roomId }) 
      })
      if (response.status === 200) {
        const data = await response.json()
        iceServers.push(...data.iceServers)
        setRTCConfig(data)
      }
    } catch (e) {
      console.warn("Failed to fetch TURN credentials", e)
    }
    return { iceServers }
  }

  const toggleVideo = () => {
    if (!localStream.current) return
    const videoTrack = localStream.current.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setIsVideoEnabled(videoTrack.enabled)
    }
  }

  const toggleAudio = () => {
    if (!localStream.current) return
    const audioTrack = localStream.current.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setIsAudioEnabled(audioTrack.enabled)
    }
  }

  const initMedia = async () => {
    const videoEl = videoSelfRef.current
    if (!videoEl || !navigator.mediaDevices || (pendingRTCConfig.current || RTCConfig)) return

    try {
      pendingRTCConfig.current = true
      if (localStream.current) {
        localStream.current.getTracks().forEach(t => t.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      
      videoEl.srcObject = stream
      localStream.current = stream 
      
      setIsVideoEnabled(true)
      setIsAudioEnabled(true)

      const turnCredentials = await getTurnCredentials()

      const config: RTCConfiguration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun.flappychat.com:3478" },
          ...turnCredentials.iceServers,
        ],
        iceTransportPolicy: 'all',
        iceCandidatePoolSize: 10
      }
      
      const pc = new RTCPeerConnection(config)
      peerConnection.current = pc

      if (role === 'host') {
        const dataChannel = pc.createDataChannel('chat')
        dataChannelRef.current = dataChannel
        dataChannel.onopen = () => {
          console.log('Data channel is open')
        }
        dataChannel.onmessage = (event) => {
          console.log('Data channel message:', event.data)
        }
        dataChannel.onclose = () => {
          console.log('Data channel is closed')
        }
      }

      pc.ondatachannel = (event) => {
        dataChannelRef.current = event.channel
        console.log('Data channel created:', event.channel)
        event.channel.onopen = () => {
          console.log('Data channel is open')
        }

        event.channel.onmessage = (event) => {
          console.log('Data channel message:', event.data)
        }

        event.channel.onclose = () => {
          console.log('Data channel is closed')
        }
      }

      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState
        if (state === 'failed') {
          console.error('ICE connection FAILED')
          onError('Connection failed. Please check your network.')
        }
      }
      
      pc.onicecandidate = event => {
        if (event.candidate && socket) {
          socket.emit('sendCandidate', event.candidate) 
        }
      }
      
      pc.ontrack = event => {
        const remoteVideo = videoRemoteRef.current
        if (!remoteVideo || !event.streams[0]) return
        
        if (remoteVideo.srcObject !== event.streams[0]) {
          remoteVideo.srcObject = event.streams[0]
          remoteVideo.muted = false
          remoteVideo.play()
        }
      }
      
      stream.getTracks().forEach(track => {
        track.enabled = true
        pc.addTrack(track, stream)
      })

      if (pendingOffer.current) {
        const storedOffer = pendingOffer.current
        pendingOffer.current = null
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(storedOffer))
          for (const candidate of pendingIceCandidates.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
          }
          pendingIceCandidates.current = []
          
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          socket?.emit('answer', answer)
        } catch (e) {
          console.error('Error processing delayed offer:', e)
        }
      } else if (pendingIceCandidates.current.length > 0) {
        for (const candidate of pendingIceCandidates.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
        }
        pendingIceCandidates.current = [];
      }

      setIsMediaReady(true)

    } catch (err) {
      console.error('Failed to initialize media:', err)
      onError('Failed to access camera/microphone')
    }
    pendingRTCConfig.current = false
  }


  useEffect(() => {
    if (!socket) return
    
    const processOffer = async (pc: RTCPeerConnection, offerData: RTCSessionDescriptionInit) => {
      if (!pc) return;
      if (isOfferer.current) {
        window.location.reload()
        return
      }
      if (pc.signalingState !== 'stable') {
        console.warn('Cannot process offer, signaling state:', pc.signalingState)
        return
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offerData))
        for (const candidate of pendingIceCandidates.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingIceCandidates.current = []
        
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.emit('answer', answer)
      } catch (err) {
        console.error('Failed to handle offer:', err)
      }
    }

    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
      const pc = peerConnection.current
      if (pc) {
        processOffer(pc, offer)
      } else {
        pendingOffer.current = offer
        setTimeout(() => {
          const pcRetry = peerConnection.current;
          if (pcRetry && pendingOffer.current) {
            const storedOffer = pendingOffer.current
            pendingOffer.current = null
            processOffer(pcRetry, storedOffer)
          }
        }, 500)
      }
    }

    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
      const pc = peerConnection.current
      if (!pc || !isOfferer.current) return
      if (pc.signalingState !== 'have-local-offer') {
        console.warn('Wrong signaling state for answer:', pc.signalingState)
        return
      }
      
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
        for (const candidate of pendingIceCandidates.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
        }
        pendingIceCandidates.current = []
      } catch (err) {
        console.error('Failed to set remote description (answer):', err)
      }
    }

    const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
      if (!candidate || !candidate.candidate) return
      const pc = peerConnection.current
      
      if (!pc) {
        pendingIceCandidates.current.push(candidate)
        return
      }
      
      if (pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (err) {
          console.error('Failed to add ICE candidate:', err)
        }
      } else {
        pendingIceCandidates.current.push(candidate)
      }
    }

    const handleUserJoined = async () => {
      const pc = peerConnection.current;
      if (pc && pc.signalingState === 'stable') {
        isOfferer.current = true
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socket.emit('offer', offer)
      } else {
        console.warn('Cannot create offer:', { hasPC: !!pc, signalingState: pc?.signalingState })
      }
    }
    
    const handleJoinError = (message: string) => {
      console.error('Join error:', message)
      onError(message)
      clearRefs()
    }

    const handleJoin = (data: { role: 'host' | 'guest' }) => {
      setRole(data.role)
    }

    socket.on('userjoined', handleUserJoined)
    socket.on('joinroom', handleJoin)
    socket.on('joinerror', handleJoinError)
    socket.on('icecandidate', handleIceCandidate)
    socket.on('offer', handleOffer)
    socket.on('answer', handleAnswer)

    return () => {
      socket.off('userjoined', handleUserJoined)
      socket.off('joinroom', handleJoin)
      socket.off('joinerror', handleJoinError)
      socket.off('icecandidate', handleIceCandidate)
      socket.off('offer', handleOffer)
      socket.off('answer', handleAnswer)
    }
  }, [socket, onError])

  const joinRoom = (userName: string) => {
    if (!socket || joined.current || !userName) return
    socket.emit('joinroom', { roomId, name: userName })
    joined.current = true
  }

  return {
    videoSelfRef,
    videoRemoteRef,
    dataChannelRef,
    isVideoEnabled,
    isAudioEnabled,
    isMediaReady,
    toggleVideo,
    toggleAudio,
    initMedia,
    joinRoom,
    clearRefs
  }
}