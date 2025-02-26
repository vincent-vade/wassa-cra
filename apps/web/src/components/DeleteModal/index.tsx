import { modals } from '@mantine/modals'

export const deleteModal = ({
	title = 'Delete Modal',
	onConfirm,
	onCancel,
}: {
	title?: string
	onConfirm?: () => void
	onCancel?: () => void
}) =>
	modals.openConfirmModal({
		title,
		centered: true,
		children: (
			<div>
				Are you sure you want to delete your profile? This action is destructive
				and you will have to contact support to restore your data.
			</div>
		),
		labels: { confirm: 'Delete', cancel: "No don't delete it" },
		confirmProps: { color: 'red' },
		onCancel,
		onConfirm,
	})
