type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'default' | 'inverse';
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'default',
}: SectionHeadingProps) {
  const isCentered = align === 'center';
  const titleClass = tone === 'inverse' ? 'text-white' : 'text-foreground';
  const descriptionClass = tone === 'inverse' ? 'text-white/68' : 'text-muted';
  const eyebrowClass = tone === 'inverse' ? 'border-white/10 bg-white/5 text-[#f6ebdf]' : '';

  return (
    <div className={isCentered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <span className={`eyebrow ${eyebrowClass}`}>{eyebrow}</span>
      <h2
        className={`display-balance mt-5 font-display text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl ${titleClass}`}
      >
        {title}
      </h2>
      <p className={`body-balance mt-5 text-lg leading-8 ${descriptionClass}`}>{description}</p>
    </div>
  );
}
