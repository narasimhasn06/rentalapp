// A2 shared component library (spec/foundations.md). Built once, used
// everywhere by name — see CLAUDE.md §4. Feature lanes must not modify
// these files directly; build a local version and mark it
// `// PROMOTE:` instead (.claude/rules/parallel.md).

export { Button, IconButton } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonHeight, IconButtonProps } from "./Button";

export { Spinner } from "./Spinner";
export { Tooltip } from "./Tooltip";

export { StatusChip } from "./StatusChip";
export type { StatusChipProps, StatusTone } from "./StatusChip";

export { StatCard } from "./StatCard";
export type { StatCardProps } from "./StatCard";

export { DataTable, DataTableActions } from "./DataTable";
export type { DataTableColumn, DataTableProps } from "./DataTable";

export { DetailPanel } from "./DetailPanel";
export type { DetailPanelProps } from "./DetailPanel";

export { Timeline } from "./Timeline";
export type { TimelineEvent, TimelineProps } from "./Timeline";

export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";

export { ToastProvider, useToast } from "./Toast";
export type { ToastOptions } from "./Toast";

export { ConfirmDialog } from "./ConfirmDialog";
export type { ConfirmDialogProps } from "./ConfirmDialog";

export { TextField } from "./fields/TextField";
export type { TextFieldProps } from "./fields/TextField";

export { MoneyField } from "./fields/MoneyField";
export type { MoneyFieldProps } from "./fields/MoneyField";

export { PhoneField } from "./fields/PhoneField";
export type { PhoneFieldProps } from "./fields/PhoneField";

export { DateField } from "./fields/DateField";
export type { DateFieldProps } from "./fields/DateField";

export { Dropdown } from "./fields/Dropdown";
export type { DropdownOption, DropdownProps } from "./fields/Dropdown";

export { SegmentedChoice } from "./fields/SegmentedChoice";
export type { SegmentedChoiceOption, SegmentedChoiceProps } from "./fields/SegmentedChoice";

export { TextArea } from "./fields/TextArea";
export type { TextAreaProps } from "./fields/TextArea";

export { PhotoUploader } from "./fields/PhotoUploader";
export type { PhotoUploaderProps } from "./fields/PhotoUploader";
