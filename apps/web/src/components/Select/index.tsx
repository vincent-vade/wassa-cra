import { Project } from '~/lib/client';

type SelectProps<T> = {
	options: T[];
	getOptionLabel: (option: T) => string;
	getOptionValue: (option: T) => string;
	onChange: (value: string) => void;
	defaultValue?: string;
};

export const Select_OLD = () => {
	return (
		<select
			ref={selectProjectRef}
			className="ml-2"
			onChange={handleChangeProject}
		>
			<option value="">Select a project</option>
			{projects.map((project: Project) => (
				<option key={project.id} value={`${project.id}#${project.name}`}>
					{project.name}
				</option>
			))}
		</select>
	);
};

export const Select = <T,>({
	ref,
	options,
	getOptionLabel,
	getOptionValue,
	onChange,
	defaultValue,
}: SelectProps<T>) => {
	return (
		<select
			ref={ref}
			onChange={(e) => onChange(e.target.value)}
			defaultValue={defaultValue}
		>
			<option value="">Select an option</option>
			{options.map((option) => (
				<option
					key={getOptionValue(option)}
					value={`${getOptionValue(option)}#${getOptionLabel(option)}`}
				>
					{getOptionLabel(option)}
				</option>
			))}
		</select>
	);
};
