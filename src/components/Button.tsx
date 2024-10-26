import { ComponentType } from "react";
import { Link } from "react-router-dom";

type TSizes = "sm" | "md" | "xl" | "2xl" | "3xl";

type TProps = {
    title?: string;
    bgColor?: string;
    onClick?: () => void;
    disabled?: boolean;
    IconRight?: ComponentType<{}>;
    IconLeft?: ComponentType<{}>;
    withAnimation?: boolean;
    size?: TSizes; // sm md xl 2xl etc
    to?: string | null;
    externalLink?: string | null;
};

const ButtonElem = ({ withAnimation, bgColor, size, onClick, disabled, IconLeft, title, IconRight }: TProps) => (
    <button
        className={`btn ${
            withAnimation ? "with-animation" : ""
        } ${bgColor} text-white rounded-full  md:px-12 px-6 py-3 md:py-4 flex gap-3 items-center justify-center shadow-sm text-${size}`}
        type="button"
        aria-label={title}
        onClick={onClick}
        disabled={disabled}
    >
        {IconLeft && (
            <>
                <IconLeft />
            </>
        )}
        {title}
        {IconRight && (
            <>
                <IconRight />
            </>
        )}
    </button>
);

const Button = ({
    withAnimation = false,
    title = "click me",
    bgColor = "bg-indigo-600",
    onClick,
    disabled = false,
    IconRight,
    IconLeft,
    size = "md",
    to = null,
    externalLink = null,
}: TProps) => {
    if (externalLink) {
        return (
            <a target="_blank" rel="noreferrer noopener" href={externalLink}>
                <ButtonElem
                    withAnimation={withAnimation}
                    title={title}
                    bgColor={bgColor}
                    onClick={onClick}
                    disabled={disabled}
                    IconRight={IconRight}
                    IconLeft={IconLeft}
                    size={size}
                />
            </a>
        );
    }
    if (to) {
        return (
            <Link to={to}>
                <ButtonElem
                    withAnimation={withAnimation}
                    title={title}
                    bgColor={bgColor}
                    onClick={onClick}
                    disabled={disabled}
                    IconRight={IconRight}
                    IconLeft={IconLeft}
                    size={size}
                />
            </Link>
        );
    }

    return (
        <ButtonElem
            withAnimation={withAnimation}
            title={title}
            bgColor={bgColor}
            onClick={onClick}
            disabled={disabled}
            IconRight={IconRight}
            IconLeft={IconLeft}
            size={size}
        />
    );
};

export default Button;
