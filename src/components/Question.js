function Question({ question, value, onChange }) {
  return (
    <div className="mb-4">
      <p className="text-gray-800 font-medium mb-2">{question}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`py-2 px-4 border rounded-md ${value === num ? "bg-blue-500 text-white" : "bg-gray-200"} transition-all`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;
