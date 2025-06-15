'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Calendar } from 'lucide-react';

interface AuthorDisplayProps {
  author: {
    name: string;
    image?: string;
  };
  createdAt?: string;
  showDate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AuthorDisplay({ 
  author, 
  createdAt, 
  showDate = true, 
  size = 'md',
  className = '' 
}: AuthorDisplayProps) {
  const sizeClasses = {
    sm: {
      avatar: 'h-6 w-6',
      text: 'text-xs',
      nameText: 'text-xs',
      icon: 'h-3 w-3'
    },
    md: {
      avatar: 'h-8 w-8',
      text: 'text-sm',
      nameText: 'text-sm',
      icon: 'h-3 w-3'
    },
    lg: {
      avatar: 'h-12 w-12',
      text: 'text-base',
      nameText: 'text-base',
      icon: 'h-4 w-4'
    }
  };

  const styles = sizeClasses[size];

  const formattedDate = createdAt ? (() => {
    try {
      return new Date(createdAt).toLocaleDateString();
    } catch (e) {
      return 'Unknown date';
    }
  })() : '';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className={`${styles.avatar} border-2 border-yellow`}>
        <AvatarImage src={author.image} alt={author.name} />
        <AvatarFallback className="bg-yellow text-navy font-bold">
          {author.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <User className={`${styles.icon} text-navy/60`} />
          <span className={`${styles.nameText} font-semibold text-navy truncate`}>
            {author.name}
          </span>
        </div>
        {showDate && createdAt && (
          <div className={`flex items-center gap-1 ${styles.text} text-navy/50`}>
            <Calendar className={styles.icon} />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
} 