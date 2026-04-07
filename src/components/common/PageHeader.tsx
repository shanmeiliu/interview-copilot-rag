type Props = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: Props) {
  return (
    <div className="border-b border-zinc-800 px-6 py-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      {description ? <p className="mt-1 text-sm text-zinc-400">{description}</p> : null}
    </div>
  );
}