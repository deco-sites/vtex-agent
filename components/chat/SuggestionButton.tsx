interface Props {
  text: string;
  onClick: () => void;
}

export default function SuggestionButton({ text, onClick }: Props) {
  return (
    <button
      class="block w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
