import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: CardProps) {
    return (
        <div className={cn("flex flex-col space-y-1.5 pb-4", className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }: CardProps) {
    return (
        <h3 className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className }: CardProps) {
    return (
        <div className={cn("p-0", className)}>
            {children}
        </div>
    );
}
