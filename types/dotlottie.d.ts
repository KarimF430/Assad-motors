// Type declarations for @lottiefiles/dotlottie-wc web component
declare namespace JSX {
    interface IntrinsicElements {
        'dotlottie-wc': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                src?: string;
                autoplay?: boolean;
                loop?: boolean;
                speed?: number;
                direction?: 1 | -1;
                mode?: 'normal' | 'bounce';
                background?: string;
            },
            HTMLElement
        >;
    }
}
