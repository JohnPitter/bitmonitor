export default function Flag({ code, size = 20 }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={code}
      className="inline-block rounded-sm object-cover"
      style={{ width: size, height: Math.round(size * 0.75) }}
    />
  );
}
