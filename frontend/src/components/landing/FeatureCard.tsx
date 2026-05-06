import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <article className="rounded-lg border border-line bg-panel/75 p-5 shadow-glow backdrop-blur transition hover:border-mint/25 hover:bg-panel-soft/75">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-mint/25 bg-mint/10 text-mint">
        <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
      </div>
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </article>
  );
}

export default FeatureCard;
