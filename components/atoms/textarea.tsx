import * as React from "react";
import { cn } from "@/components/utils";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, error, ...props }, ref) => {
		return (
			<textarea
				ref={ref}
				className={cn(
					`
          w-full min-h-24 p-3 rounded-md resize-none
          bg-surface text-textPrimary
          border border-border
          placeholder:text-textMuted
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/50
          focus:border-primary
        `,
					error &&
						`
            border-error text-error
            focus:ring-error/40 focus:border-error
          `,
					className,
				)}
				{...props}
			/>
		);
	},
);

Textarea.displayName = "Textarea";

export { Textarea };
