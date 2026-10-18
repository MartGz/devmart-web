import { cubeFaces } from "./Cube";

// Escalera isométrica de cubos que crece hasta el cubo de DevMart (idea → producto).
// Ejes isométricos sobre un cubo de 100 de ancho: x = (i − j)·50, y = (i + j)·28.868 − k·57.735.
const ALTURAS = [
  [1, 2, 3, 4], // fila trasera (j = 0)
  [0, 1, 1, 2], // fila delantera (j = 1)
];

const cubos = ALTURAS.flatMap((fila, j) => fila.flatMap((h, i) => Array.from({ length: h }, (_, k) => ({ i, j, k }))))
  // De atrás hacia delante y de abajo arriba, para que cada cara tape la que queda detrás.
  .sort((a, b) => a.i + a.j - (b.i + b.j) || a.k - b.k || b.j - a.j);

export function CubosEscalera({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-60 -100 330 345"
      className={className}
      role="img"
      aria-label="Escalera de cubos que crece hasta el cubo de DevMart"
    >
      {cubos.map(({ i, j, k }) => {
        const x = 50 * (i - j);
        const y = 28.868 * (i + j) - 57.735 * k;
        const marca = i === 3 && j === 0 && k === 3;
        return (
          <g key={`${i}-${j}-${k}`} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
            {marca ? (
              <g className="cube-float cube-hover">
                <polygon points={cubeFaces.top} fill="#FFFFFF" />
                <polygon points={cubeFaces.left} fill="#3EC1F3" />
                <polygon points={cubeFaces.right} fill="#1E8FD0" className="cube-right" transform="translate(8.7 5)" />
              </g>
            ) : (
              <g stroke="rgba(245,247,250,0.10)" strokeWidth={0.8}>
                <polygon points={cubeFaces.top} fill="#1A2030" />
                <polygon points={cubeFaces.left} fill="#131823" />
                <polygon points={cubeFaces.right} fill="#0F131C" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
