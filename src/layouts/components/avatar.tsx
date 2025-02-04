import { cn } from "@/lib/shadcn";
import Image from "next/image";
import { ComponentProps } from "react";
import Gravatar from "react-gravatar";

type ImageProps = Omit<ComponentProps<typeof Image>, "src">;

type Props = ImageProps & { src?: string; email?: string };

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function Avatar(props: Props) {
  if (props.src) {
    const { src, alt, ...rest } = props;
    const source = src?.startsWith("http") ? src : `${BUCKET_URL}/${src}`;
    return <Image src={source} alt={alt} {...rest} />;
  } else if (props.email) {
    const { email, ...rest } = props;
    return (
      <Gravatar
        email={email}
        className={cn("rounded-full", rest.className)}
        alt={rest.alt}
        default="mp"
        size={+(rest.width || 200)}
      />
    );
  }
}
