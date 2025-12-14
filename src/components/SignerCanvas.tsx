import { useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import type { SignaturePlacement } from "../types"; 

type Props = {
  pageUrl: string; 
  signatureUrl: string; 
  width: number;
  height: number;
  onSave: (placement: SignaturePlacement) => void;
  onCancel: () => void;
};

export const SignerCanvas = ({
  pageUrl,
  signatureUrl,
  width,
  height,
  onSave,
  onCancel,
}: Props) => {
  const stageRef = useRef<any>(null);
  const sigRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const [pageImage] = useImage(pageUrl);
  const [sigImage] = useImage(signatureUrl);

  useEffect(() => {
    if (sigRef.current) {
      trRef.current.nodes([sigRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [sigImage]);

  const handleSave = () => {
    if (!sigRef.current || !sigImage) return;
    const node = sigRef.current;
    const scale = node.scaleX();

    onSave({
      x: node.x(),
      y: node.y(),
      width: sigImage.width * scale,
      height: sigImage.height * scale,
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        className="border rounded shadow bg-white"
      >
        <Layer>
          {/* background page */}
          {pageImage && (
            <KonvaImage image={pageImage} width={width} height={height} />
          )}

          {/* signature */}
          {sigImage && (
            <KonvaImage
              image={sigImage}
              ref={sigRef}
              x={50}
              y={50}
              draggable
              width={sigImage.width / 1.5}
              height={sigImage.height / 1.5}
            />
          )}

          <Transformer
            ref={trRef}
            rotateEnabled={false}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]}
          />
        </Layer>
      </Stage>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Save Placement
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
