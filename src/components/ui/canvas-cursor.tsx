import useCanvasCursor from "~/hooks/useCanvasCursor";
 
const CanvasCursor = () => {
  useCanvasCursor();
 
  return (
    <canvas
      className="pointer-events-none fixed inset-0 left-0 right-0 top-0 bottom-0"
      id="canvas"
    />
  );
};
export default CanvasCursor;