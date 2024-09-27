    import { ColorSwatch, Group } from '@mantine/core';
    import { Button } from '@/components/ui/button';
    import { useEffect, useRef, useState, useCallback } from 'react';
    import axios from 'axios';
    import Draggable from 'react-draggable';
    import { SWATCHES } from '@/constants';

    interface Response {
        expr: string;
        result: string;
        assign: boolean;
    }

    interface MathJaxConfig {
        tex2jax: {
            inlineMath: string[][];
        };
        skipStartupTypeset: boolean;
    }

    interface MathJaxHub {
        Config: (config: MathJaxConfig) => void;
        Queue: (tasks: (string | (() => void))[]) => void;
        Startup: {
            onload: () => void;
        };
    }

    interface MathJax {
        Hub: MathJaxHub;
    }

    declare global {
        interface Window {
            MathJax: MathJax;
        }
    }

    export default function Home() {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const canvasContainerRef = useRef<HTMLDivElement>(null);
        const [isDrawing, setIsDrawing] = useState(false);
        const [color, setColor] = useState('rgb(255, 255, 255)');
        const [reset, setReset] = useState(false);
        const [dictOfVars, setDictOfVars] = useState<Record<string, string>>({});
        const [latexExpressions, setLatexExpressions] = useState<Array<{id: string, latex: string, position: {x: number, y: number}}>>([]);

        const initMathJax = useCallback(() => {
            if (window.MathJax) {
                window.MathJax.Hub.Config({
                    tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
                    skipStartupTypeset: false,
                });
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
                window.MathJax.Hub.Startup.onload();
            }
        }, []);

        useEffect(() => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
            script.async = true;
            script.onload = initMathJax;
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }, [initMathJax]);

        useEffect(() => {
            if (window.MathJax && latexExpressions.length > 0) {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }
        }, [latexExpressions]);

        useEffect(() => {
            const canvas = canvasRef.current;
            const container = canvasContainerRef.current;
        
            if (canvas && container) {
                const resizeCanvas = () => {
                    canvas.width = container.clientWidth;
                    canvas.height = container.clientHeight;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.lineCap = 'round';
                        ctx.lineWidth = 3;
                    }
                };
        
                resizeCanvas();
                window.addEventListener('resize', resizeCanvas);
        
                return () => {
                    window.removeEventListener('resize', resizeCanvas);
                };
            }
        }, []);

        const resetCanvas = useCallback(() => {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        }, []);

        const resetCompleteCanvas = useCallback(() => {
            const canvas = canvasRef.current;
            if (canvas){
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                setLatexExpressions([]);
                setDictOfVars({});
            }
        }, [resetCanvas]);

        const addLatexExpression = useCallback((expression: string, answer: string) => {
            const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        
            const container = canvasContainerRef.current;
            if (container) {
                const newExpression = {
                    id: Date.now().toString(),
                    latex,
                    position: { 
                        x: canvasContainerRef.current.clientWidth/2, 
                        y: canvasContainerRef.current.clientHeight/2  
                    },
                };
                setLatexExpressions(prev => [...prev, newExpression]);
            }
        
            setTimeout(() => {
                if (window.MathJax) {
                    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
                }
            }, 0);
        }, []);

        useEffect(() => {
            if (reset) {
                resetCompleteCanvas();
                setReset(false);
            }
        }, [reset, resetCanvas]);

        const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                canvas.style.background = 'black';
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    setIsDrawing(true);
                }
            }
        };

        const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (!isDrawing) return;
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.strokeStyle = color;
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        };

        const stopDrawing = () => {
            setIsDrawing(false);
        };  

        const runRoute = async () => {
            const canvas = canvasRef.current;
        
            if (canvas) {
                try {
                    const response = await axios({
                        method: 'post',
                        url: `${import.meta.env.VITE_API_URL}/calculate`,
                        data: {
                            image: canvas.toDataURL('image/png'),
                            dict_of_vars: dictOfVars
                        }
                    });

                    const resp = await response.data;
                    console.log('Response', resp);
                    
                    resp.data.forEach((data: Response) => {
                        if (data.assign === true) {
                            setDictOfVars(prevVars => ({
                                ...prevVars,
                                [data.expr]: data.result
                            }));
                        }
                        addLatexExpression(data.expr, data.result);
                    });
                    resetCanvas();
                } catch (error) {
                    console.error("Error in runRoute:", error);
                }
            }
        };

        return (
            <div className="flex flex-col min-h-screen bg-gray-100">
                <header className="bg-black text-white shadow-md p-4">
                    <h1 className="text-2xl font-bold text-center">AI Notes Calculator</h1>
                </header>
            
                <main className="flex-grow relative">
                    <div className="absolute top-4 left-4 right-4 z-30 bg-white p-4 rounded-lg shadow-md">
                        <div className='grid grid-cols-3 gap-2'>
                            <Button
                                onClick={() => setReset(true)}
                                className='bg-red-500 hover:bg-red-600 text-white transition-colors duration-200'
                                variant='default'
                            >
                                Reset
                            </Button>
                            <Group className='justify-center'>
                                {SWATCHES.map((swatch) => (
                                    <ColorSwatch 
                                        key={swatch} 
                                        color={swatch} 
                                        onClick={() => setColor(swatch)} 
                                        className="cursor-pointer hover:scale-110 transition-transform duration-200 border-black"
                                    />
                                ))}
                            </Group>
                            <Button
                                onClick={runRoute}
                                className='bg-green-500 hover:bg-green-600 text-white transition-colors duration-200'
                                variant='default'
                            >
                                Run
                            </Button>
                        </div>
                    </div>
                    <div ref={canvasContainerRef} className='relative w-full h-[calc(100vh-7rem)] bg-black overflow-auto'>
                        {latexExpressions.map(({ id, latex, position }) => (
                            <Draggable
                                key={id}
                                defaultPosition={position}
                                onStop={(e, data) => {
                                    setLatexExpressions(prev => 
                                        prev.map(expr => 
                                            expr.id === id ? { ...expr, position: { x: data.x, y: data.y } } : expr
                                        )
                                    );
                                }}
                            >
                                <div className="absolute p-2 bg-black text-white rounded shadow-md z-40">
                                    <div className="latex-content" dangerouslySetInnerHTML={{ __html: latex }} />
                                </div>
                            </Draggable>
                        ))}
                        <canvas
                            ref={canvasRef}
                            id='canvas'
                            className='w-full h-full'
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                        />
                    </div>
                </main>
            
                <footer className="bg-black text-white shadow-md p-4 mt-auto">
                    <p className="text-center text-sm">© 2024 AI Calc. All rights reserved <a href='https://github.com/ayam04'>@Ayam</a></p>
                </footer>
            </div>
        );
    }
