import { icons } from "../config/icons";
import type { IconProps } from "../model/types";

export const Icon = ({ name, size = 24, color, ...props }: IconProps) => {
  const IconComponent = icons[name];
  
  return (
    <IconComponent
      width={size}
      height={size}
      fill={color}
      {...props}
    />
  );
}
