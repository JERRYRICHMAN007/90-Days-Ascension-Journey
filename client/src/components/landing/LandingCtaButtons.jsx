import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const primaryBtnClass =
  'w-full sm:w-auto h-10 px-5 text-sm sm:h-11 sm:px-6 md:h-12 md:px-7 md:text-base bg-gradient-to-r from-primary via-accent to-secondary text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] group';

const secondaryBtnClass =
  'w-full sm:w-auto h-10 px-5 text-sm sm:h-11 sm:px-6 md:h-12 md:px-7 md:text-base border-2 hover:bg-white hover:text-black hover:border-white transition-colors';

export function LandingCtaButtons({
  primaryLabel = 'Start Your Journey Free',
  secondaryLabel = 'Sign In',
  className,
  align = 'center',
}) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full',
        align === 'center' && 'justify-center max-w-xs sm:max-w-none mx-auto',
        align === 'start' && 'justify-center lg:justify-start max-w-xs sm:max-w-none mx-auto lg:mx-0',
        className
      )}
    >
      <Link to="/signup" className="w-full sm:w-auto flex justify-center">
        <Button size="lg" className={primaryBtnClass}>
          {primaryLabel}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </Button>
      </Link>
      <Link to="/signin" className="w-full sm:w-auto flex justify-center">
        <Button size="lg" variant="outline" className={secondaryBtnClass}>
          {secondaryLabel}
        </Button>
      </Link>
    </div>
  );
}
