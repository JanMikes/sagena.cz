interface ComponentErrorProps {
  componentType?: string;
  showDetails?: boolean;
}

export function ComponentError({ componentType, showDetails }: ComponentErrorProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
      <p>Obsah není k dispozici</p>
      {showDetails && componentType && (
        <p className="text-sm mt-2 text-gray-400">Component: {componentType}</p>
      )}
    </div>
  );
}
