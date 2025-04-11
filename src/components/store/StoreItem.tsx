
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Lock, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StoreItemProps {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'theme' | 'avatar' | 'badge' | 'feature';
  iconUrl: string;
  isPurchased: boolean;
  isLocked: boolean;
  onPurchase: (id: string) => void;
  onUse: (id: string) => void;
}

const StoreItem: React.FC<StoreItemProps> = ({
  id,
  title,
  description,
  price,
  type,
  iconUrl,
  isPurchased,
  isLocked,
  onPurchase,
  onUse
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 border-2",
      isPurchased ? "border-green-500/30 bg-green-50/10" : "",
      isLocked ? "border-gray-300 bg-gray-50/50" : ""
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center">
            {type === 'feature' && <Sparkles className="h-4 w-4 text-epic-purple mr-1" />}
            {title}
          </span>
          <span className="flex items-center text-sm font-normal text-amber-500">
            <Coins className="h-4 w-4 mr-1" />
            {price}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex justify-center mb-2">
          <div className="text-3xl bg-muted/20 p-4 rounded-full aspect-square flex items-center justify-center">
            {iconUrl}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        {isLocked ? (
          <Button disabled variant="outline" className="w-full" size="sm">
            <Lock className="h-4 w-4 mr-1" />
            Locked
          </Button>
        ) : isPurchased ? (
          <Button 
            variant="outline" 
            className="w-full border-green-500 text-green-600" 
            size="sm"
            onClick={() => onUse(id)}
          >
            <Check className="h-4 w-4 mr-1" />
            Use
          </Button>
        ) : (
          <Button 
            variant="default" 
            className="w-full" 
            size="sm"
            onClick={() => onPurchase(id)}
          >
            Purchase
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StoreItem;
