'use client';
import {useCallback, useEffect, useState} from 'react';
import {IoMdClose} from 'react-icons/io';
import Button from '../Button';

interface ModalProps {
	isOpen?: boolean;
	onClose: () => void;
	onSubmit: () => void;
	title?: string;
	body?: React.ReactElement;
	footer?: React.ReactElement;
	actionLabel: string;
	disabled?: boolean;
	secondaryAction?: () => void;
	secondaryLabel?: string;
	secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	title,
	body,
	footer,
	actionLabel,
	disabled,
	secondaryAction,
	secondaryLabel,
	secondaryActionLabel,
}) => {
	const [showModal, setShowModal] = useState(isOpen);
	useEffect(() => {
		setShowModal(isOpen);
	}, [isOpen]);
	//close modal handler
	const handleClose = useCallback(() => {
		if (disabled) {
			return;
		}
		setShowModal(false);
		setTimeout(() => {
			onClose();
		}, 300);
	}, [disabled, onClose]);
	//submit modal handler
	const handleSubmit = useCallback(() => {
		if (disabled) {
			return;
		}
		onSubmit();
	}, [disabled, onSubmit]);
	//secondary action handler
	const handleSecondaryAction = useCallback(() => {
		if (disabled || !secondaryAction) {
			return;
		}
		secondaryAction();
	}, [disabled, secondaryAction]);
	if (!isOpen) {
		return null;
	}
	return (
		<div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed z-50 inset-0 outline-none focus:outline-none bg-neutral-800/70'>
			<div className='relative lg:h-auto w-full md:h-auto md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 h-full mx-auto'>
				{/* content */}
				<div
					className={`translate duration-300 h-full ${
						showModal ? 'translate-y-0' : 'translate-y-full'
					} ${showModal ? 'opacity-100' : 'opacity-0'}`}
				>
					<div className='translate h-full lg:h-auto md:h-auto w-full border-0 bg-white rounded-lg relative flex flex-col outline-none focus:outline-none'>
						{/* header */}
						<div className='flex relative p-6 items-center rounded-t border-b-[1px] justify-center'>
							<button
								onClick={handleClose}
								className='p-1 border-0 hover:opacity-70 transition absolute left-9'
							>
								<IoMdClose size={18} />
							</button>
							<div className='text-lg font-semibold'>{title}</div>
						</div>
						{/* body */}
						<div className='relative p-6  flex-auto'>{body}</div>
						{/* footer */}
						<div className='flex flex-col gap-2 p-6'>
							<div className='flex flex-row items-center gap-4 w-full'>
								{secondaryAction && secondaryActionLabel && (
									<Button
										disabled={disabled}
										label={secondaryActionLabel}
										onClick={handleSecondaryAction}
										outline
									/>
								)}
								<Button
									disabled={disabled}
									label={actionLabel}
									onClick={handleSubmit}
								/>
							</div>
							{footer}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;