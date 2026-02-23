export interface Props {
  value?: string;
  onChange: (html: string, json: Record<string, unknown>) => void;
}
