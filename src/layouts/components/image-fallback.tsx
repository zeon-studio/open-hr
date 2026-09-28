"use client";

const ImageFallback = (props: any) => {
  const { src, fallback, ...rest } = props;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      {...rest}
      src={src}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = fallback;
      }}
    />
  );
};

export default ImageFallback;
