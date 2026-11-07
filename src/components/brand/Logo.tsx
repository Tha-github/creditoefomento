import { brand } from '@/config/brand';

import styles from './Logo.module.css';

interface LogoProps {
  className?: string;
}

/**
 * Único ponto de renderização da marca. O nome em texto simples é apenas um substituto
 * provisório e sai de cena assim que `brand.logo` recebe o arquivo original.
 */
export function Logo({ className }: LogoProps) {
  const { logo, name } = brand;

  if (!logo) {
    return <span className={[styles.name, className].filter(Boolean).join(' ')}>{name}</span>;
  }

  return (
    <img
      className={className}
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      decoding="async"
    />
  );
}
