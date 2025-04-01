import { cn } from "@/lib/utils";
import { AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { JSX } from "react";

type Variant = "default" | "warning" | "success";

const variantStyles: Record<Variant, string> = {
  default: "bg-muted text-muted-foreground",
  warning: "bg-orange-100 text-orange-800 border border-orange-300",
  success: "bg-green-100 text-green-800 border border-green-300",
};

const icons: Record<Variant, JSX.Element> = {
  default: <Info className="h-4 w-4" />,
  warning: <AlertCircle className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
};

export function Callout({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md px-4 py-3 text-sm",
        variantStyles[variant],
        className
      )}
    >
      <div className="mt-0.5">{icons[variant]}</div>
      <div>{children}</div>
    </div>
  );
}
