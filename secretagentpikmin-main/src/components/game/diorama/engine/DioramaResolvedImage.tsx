import { useState } from "react";
import { useResolvedAssetUrl } from "@/hooks/useResolvedAssetUrl";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  onResolveError?: () => void;
}

/** <img> con risoluzione automatica diorama-asset:// */
export function DioramaResolvedImage({ src, onResolveError, onError, ...rest }: Props) {
  const resolved = useResolvedAssetUrl(src);
  const [failed, setFailed] = useState(false);

  if (!resolved || failed) return null;

  return (
    <img
      {...rest}
      src={resolved}
      onError={(e) => {
        setFailed(true);
        onResolveError?.();
        onError?.(e);
      }}
    />
  );
}
