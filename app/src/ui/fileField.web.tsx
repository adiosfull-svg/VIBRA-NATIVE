// <input type="file"> sul web: l'input vero del browser (nascosto se ha la classe hidden),
// così onChange riceve i File veri e ref.current.click() apre la scelta del file.
import { createElement, forwardRef } from 'react';

export type FileFieldProps = {
  accept?: string; multiple?: boolean; capture?: string; disabled?: boolean; className?: string;
  onChange?: (e: { target: { files: ArrayLike<unknown> | null; value: string } }) => void;
};
export type FileFieldHandle = { click: () => void };

export const FileField = forwardRef<FileFieldHandle, FileFieldProps>(({ className, ...props }, ref) =>
  createElement('input', {
    ref, type: 'file', ...props,
    style: /(^|\s)hidden(\s|$)/.test(className ?? '') ? { display: 'none' } : undefined,
  }),
);
FileField.displayName = 'FileField';
