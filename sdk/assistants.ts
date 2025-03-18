import type { AvailableIcons } from "site/components/ui/Icon.tsx";

export interface Assistant {
  /**
   * @title Título do assistente
   */
  title: string;
  /**
   * @title Descrição do assistente
   * @description Texto explicativo sobre o que o assistente faz
   */
  description: string;
  /**
   * @title Ícone do assistente
   * @description Selecione um dos ícones disponíveis no sistema
   */
  icon: AvailableIcons;
  /**
   * @title URL do assistente
   * @description Link para onde o botão direciona
   */
  url: string;
}
