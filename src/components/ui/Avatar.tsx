import { forwardRef, ImgHTMLAttributes } from 'react';
import { cn } from '../../utils/helpers';

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', src, alt, fallback, ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    };

    const initials = fallback || alt?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium overflow-hidden',
          sizes[size],
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            {...props}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
