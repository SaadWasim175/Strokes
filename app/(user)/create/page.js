"use client";
import { useRef, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import "@/styles/Create.css";
import { Supabase } from "@/lib/supabase-browser";

export default function CreatePage() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [mode, setMode] = useState("draw");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState("");

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "my-artwork.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
};
 const uploadToSupabase = async () => {
  const canvas = canvasRef.current;

  canvas.toBlob(async (blob) => {
    if (!blob) return alert("Failed to create image blob.");

    const fileName = `${Date.now()}.png`;
    const { data, error } = await Supabase.storage
      .from("artworks")
      .upload(fileName, blob, {
        contentType: "image/png",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
      return;
    }

    const {
      data: { publicUrl },
    } = Supabase.storage.from("artworks").getPublicUrl(fileName);

    const {
      data: { user },
    } = await Supabase.auth.getUser();

    if (!user) {
      alert("User not authenticated.");
      return;
    }

    const { error: insertError } = await Supabase
      .from("artworks")
      .insert([
        {
          user_id: user.id,
          username: user.email,
          url: publicUrl,
        },
      ]);

    if (insertError) {
      console.error("Insert error:", JSON.stringify(insertError, null, 2));
      alert("Failed to save artwork metadata.");
    } else {
      alert("Artwork uploaded and saved!");
    }
  }, "image/png");
};


  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = brushSize;
      ctxRef.current.strokeStyle = isEraser ? "#fff" : color;
    }
  }, [brushSize, color, isEraser]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (mode === "draw" || mode === "erase") {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    } else {
      setStartPos({ x: offsetX, y: offsetY });
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    if (mode === "draw" || mode === "erase") {
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
    }
  };

  const endDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    if (mode === "draw" || mode === "erase") {
      ctxRef.current.closePath();
      setIsDrawing(false);
    } else if (mode === "rect") {
      const width = offsetX - startPos.x;
      const height = offsetY - startPos.y;
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = brushSize;
      ctxRef.current.strokeRect(startPos.x, startPos.y, width, height);
    } else if (mode === "circle") {
      const radius = Math.sqrt(
        Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2)
      );
      ctxRef.current.beginPath();
      ctxRef.current.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctxRef.current.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
    setMode("erase");
  };

  const addText = () => {
    if (textInput.trim()) {
      ctxRef.current.font = `${brushSize * 3}px sans-serif`;
      ctxRef.current.fillStyle = color;
      ctxRef.current.fillText(textInput, 50, 50);
      setTextInput("");
    }
  };

  return (
    <div className="create-page">
      <Sidebar />
      <main className="editor-wrapper">
        <h1 className="editor-title">🎨 Start Creating</h1>
        <div className="toolbar">
          <label>
            Color
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <label>
            Brush Size
            <input type="range" min="1" max="40" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} />
          </label>

          <button onClick={() => setMode("draw")} className={mode === "draw" ? "active-btn" : ""}>Draw</button>
          <button onClick={toggleEraser} className={isEraser ? "active-btn" : ""}>Eraser</button>
          <button onClick={() => setMode("rect")} className={mode === "rect" ? "active-btn" : ""}>Rectangle</button>
          <button onClick={() => setMode("circle")} className={mode === "circle" ? "active-btn" : ""}>Circle</button>

          {/* <input
            type="text"
            placeholder="Add text..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="text-input"
          />
          <button onClick={addText}>Place Text</button> */}

          <button onClick={clearCanvas} className="clear-btn">Clear</button>
          <button onClick={downloadImage}>Download</button>
          <button onClick={uploadToSupabase} >Upload to Strokes</button>
        </div>

        <div className="canvas-frame">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            className="drawing-canvas"
          />
        </div>
      </main>
    </div>
  );
}
