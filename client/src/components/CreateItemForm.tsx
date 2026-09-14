type CreateItemFormProps = {
  name: string;
  price: string;
  quantity: string;
  error: string;
  onNameChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onSubmit: () => void;
};

// This component owns no state of its own. Every value it shows, and every
// function it calls, is handed to it from the parent (App.tsx) as props.
// That's why it's called a "controlled" or "presentational" component —
// it just displays what it's given and reports events back upward.
function CreateItemForm({
  name,
  price,
  quantity,
  error,
  onNameChange,
  onPriceChange,
  onQuantityChange,
  onSubmit,
}: CreateItemFormProps) {
  return (
    <div>
      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => onPriceChange(e.target.value)}
      />
      <input
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => onQuantityChange(e.target.value)}
      />
      <button onClick={onSubmit}>Add item</button>

      {error && <p>{error}</p>}
    </div>
  );
}

export default CreateItemForm;