'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Crown, Sparkles, Star, ArrowRight, X } from 'lucide-react';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export default function PremiumUpgradeModal({ 
  isOpen, 
  onClose, 
  feature = "create rankings" 
}: PremiumUpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-gray-900 to-black border-2 border-primary/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center text-xl font-bold text-primary">
            <Crown className="h-6 w-6 text-primary" />
            Premium Feature
          </DialogTitle>
          <DialogDescription className="text-center text-yellow-100/80">
            Unlock the full potential of RankIt
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Feature highlight */}
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <Sparkles className="h-16 w-16 text-primary animate-pulse mx-auto" />
              <Star className="absolute -top-1 -right-1 h-6 w-6 text-yellow-300 animate-bounce" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-100">
              Ready to {feature}?
            </h3>
            <p className="text-yellow-100/70 text-sm">
              This feature requires a premium subscription to access all the amazing capabilities.
            </p>
          </div>

          {/* Premium benefits */}
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Premium Benefits
            </h4>
            <ul className="space-y-2 text-sm text-yellow-100/80">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Unlimited ranking creation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Advanced customization options
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Priority support
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                No ads
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full bg-primary hover:bg-primary/80 text-black font-bold py-3"
            >
              <Link href="/premium">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full text-yellow-100/60 hover:text-yellow-100 hover:bg-primary/10"
            >
              <X className="h-4 w-4 mr-2" />
              Maybe Later
            </Button>
          </div>

          {/* Pricing hint */}
          <div className="text-center text-xs text-yellow-100/50">
            Starting from just $5/month • Cancel anytime
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 