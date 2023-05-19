import React, { Fragment } from "react";
import "./rds-text-area.css";
export interface RdsTextAreaProps {
	rows?: number;
	readonly?: boolean;
	label?: string;
	placeholder: string;
	value?: any;
	isDisabled?: boolean;
	isRequired?: boolean;
	id?: string;
	required?: boolean;
	dataTestId?: string;
	onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	labelPosition?: string;
	onClick?: (event: React.MouseEvent<HTMLTextAreaElement>) => void;
}
const RdsTextArea = (props: RdsTextAreaProps) => {
	return (
		<Fragment>
			<div>
				{!props.labelPosition && (
					<>
						{props.label && <label htmlFor={props.id} className="form-label">
							{props.label}
						</label>}

						{props.required && (
							<span className="text-danger ms-1">*</span>
						)}
					</>
				)}
				{props.labelPosition === "top" && (
					<label className="form-label">
						{props.label}
						{props.isRequired && <span className="text-danger fs-6"> *</span>}
					</label>
				)}
				<textarea
					className="form-control"
					disabled={props.isDisabled}
					id="exampleFormControlTextarea1"
					rows={props.rows}
					readOnly={props.readonly}
					placeholder={props.placeholder}
					onChange={props.onChange}
					onClick={props.onClick}
					value={props.value}
					data-testId={props.dataTestId}
				></textarea>
				{props.labelPosition === "bottom" && (
					<label className="form-label mt-1">
						{props.label}
						{props.isRequired && <span className="text-danger fs-6"> *</span>}
					</label>
				)}
			</div>
		</Fragment>
	);
};
export default RdsTextArea;
