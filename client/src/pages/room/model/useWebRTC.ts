import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { useSocketStore, useRoomStore, useModalStore, type Message, useChatStore } from "@/entities"

type onErrorType = (message: string) => void

export const useWebRTC = (roomId: string, onError: onErrorType) => {
  const { socket } = useSocketStore()
  const { closeJoinModal } = useModalStore()
  const { role, setRole, setRoomParamId, setCheckedRoom, setJoinedRoom } = useRoomStore()
  const { emit } = useChatStore()

  const videoSelfRef = useRef<HTMLVideoElement>(null)
  const videoRemoteRef = useRef<HTMLVideoElement>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const localStream = useRef<MediaStream | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const roleRef = useRef(role)
  
  const pendingRTCConfig = useRef<boolean | null>(null)
  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([])
  const pendingOffer = useRef<RTCSessionDescriptionInit | null>(null)
  const isOfferer = useRef(false)
  const joined = useRef(false)

  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isMediaReady, setIsMediaReady] = useState(false)
  const [isMediaPending, setIsMediaPending] = useState(false)
  const [RTCConfig, setRTCConfig] = useState<RTCConfiguration | null>(null)
  const [RTCDataChannelState, setRTCDataChannelState] = useState<RTCDataChannelState | null>(null)
  const [isChatOnly, setIsChatOnly] = useState(false)

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
    dataChannelRef.current?.close()
    dataChannelRef.current = null
    pendingIceCandidates.current = []
    pendingOffer.current = null
    joined.current = false
    setRoomParamId(null)
    setCheckedRoom(null)
    setRole(null)
    setJoinedRoom(false)
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

  const initWebRTCData = async (dataRole: string | null) => {
    if (!dataRole) return
    const pc = peerConnection.current
    if (!pc || !localStream.current) return
    if (dataRole === 'host') {
      const dataChannel = pc.createDataChannel('chat')
      dataChannelRef.current = dataChannel
      dataChannel.onopen = () => {
        setRTCDataChannelState(dataChannel.readyState)
        emit({ type: 'system', id: uuidv4(), text: 'You have joined chat!', sendedAt: new Date() })
      }
      dataChannel.onmessage = (event) => {
          emit(JSON.parse(event.data))
      }
      dataChannel.onclose = () => {
        setRTCDataChannelState(dataChannel.readyState)
        emit({ type: 'system', id: uuidv4(), text: 'You have left chat!', sendedAt: new Date() })
      }
    } else if (dataRole === 'guest') {
      pc.ondatachannel = (event) => {
        dataChannelRef.current = event.channel
        event.channel.onopen = () => {
          setRTCDataChannelState(event.channel.readyState)
          emit({ type: 'system', id: uuidv4(), text: 'You have joined chat!', sendedAt: new Date() })
        }
        event.channel.onmessage = (event) => {
          emit(JSON.parse(event.data))
        }
        event.channel.onclose = () => {
          setRTCDataChannelState(event.channel.readyState)
          emit({ type: 'system', id: uuidv4(), text: 'You have left chat!', sendedAt: new Date() })
        }
      }
    }
  }

  const initMedia = async () => {
    const videoEl = videoSelfRef.current
    if (!videoEl || !navigator.mediaDevices || (pendingRTCConfig.current || RTCConfig)) {
      setIsMediaPending(false)
      return
    }

    dataChannelRef.current?.close()
    dataChannelRef.current = null
    peerConnection.current?.close()
    peerConnection.current = null

    try {
      pendingRTCConfig.current = true
      if (localStream.current) {
        localStream.current.getTracks().forEach(t => t.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      videoEl.srcObject = stream
      localStream.current = stream 
      const turnCredentials = await getTurnCredentials()

      const config: RTCConfiguration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:stun.flappychat.com:3478" },
          ...turnCredentials.iceServers,
        ],
        iceTransportPolicy: 'all',
        iceCandidatePoolSize: 10
      }

      setIsVideoEnabled(true)
      setIsAudioEnabled(true)

      try {
        await videoEl.play()
      } catch (playErr) {
        console.error('Failed to play video:', playErr)
      }
    
      const pc = new RTCPeerConnection(config)
      peerConnection.current = pc

      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState
        if (state === 'connected') {
        }
        if (state === 'disconnected') {
          reconnectWebRTC()
        }
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
      
      localStream.current.getTracks().forEach(track => {
        track.enabled = true
        if(!localStream.current) return
        pc.addTrack(track, localStream.current)
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
        pendingIceCandidates.current = []
      }
    } catch (err) {
      console.error('Failed to initialize media:', err)
      setIsChatOnly(true)
      setIsMediaPending(false)
    } finally {
      pendingRTCConfig.current = false
    }
    
    setIsMediaReady(true)
    setIsMediaPending(false)
  }

  const reconnectWebRTC = async () => {
    emit({ type: 'system', id: uuidv4(), text: 'Recreating peer connection...', sendedAt: new Date() })

    try {
      await initMedia()
      
      emit({ type: 'system', id: uuidv4(), text: 'Recreated peer successfully!', sendedAt: new Date() })
    } catch (err) {
      emit({ type: 'system', id: uuidv4(), text: 'Recreating peer failed!', sendedAt: new Date() })
    }
  }


  useEffect(() => {
    if (!socket) return
    
    const processOffer = async (pc: RTCPeerConnection, offerData: RTCSessionDescriptionInit) => {
      if (!pc) return
      if (pc.signalingState !== 'stable') {
        console.warn('Cannot process offer, signaling state:', pc.signalingState)
        return
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offerData))
        for (const candidate of pendingIceCandidates.current) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
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
          const pcRetry = peerConnection.current
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
      const pc = peerConnection.current
      if (roleRef.current === 'host') initWebRTCData('host')
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

    const handleJoin = async (data: { role: 'host' | 'guest' }) => {
      roleRef.current = data.role
      setRole(data.role)
      if (roleRef.current === 'guest') initWebRTCData('guest')
    }

    const handleRoomCreated = () => {
      roleRef.current = 'host'
      setRole('host')
    }

    socket.on('userjoined', handleUserJoined)
    socket.on('joinedashost', handleRoomCreated)
    socket.on('joinroom', handleJoin)
    socket.on('joinerror', handleJoinError)
    socket.on('icecandidate', handleIceCandidate)
    socket.on('offer', handleOffer)
    socket.on('answer', handleAnswer)

    return () => {
      socket.off('userjoined', handleUserJoined)
      socket.off('joinedashost', handleRoomCreated)
      socket.off('joinroom', handleJoin)
      socket.off('joinerror', handleJoinError)
      socket.off('icecandidate', handleIceCandidate)
      socket.off('offer', handleOffer)
      socket.off('answer', handleAnswer)
    }
  }, [socket, onError])

  const joinRoom = () => {
    if (!socket || joined.current) return
    socket.emit('joinroom', { roomId })
    joined.current = true
    setJoinedRoom(true)
    closeJoinModal()
  }

  const emitMessage = (message: Message) => {
    if (dataChannelRef.current) {
      dataChannelRef.current.send(JSON.stringify(message))
    }
  }

  return {
    videoSelfRef,
    videoRemoteRef,
    dataChannelRef,
    isVideoEnabled,
    isAudioEnabled,
    isMediaReady,
    isMediaPending,
    toggleVideo,
    toggleAudio,
    initMedia,
    joinRoom,
    clearRefs,
    emitMessage,
    RTCDataChannelState,
    isChatOnly
  }
}