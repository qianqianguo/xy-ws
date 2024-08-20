import KeepAlive from 'react-activation';

export const keepAlive = (Component) => {
	return (props) => {
		return (
			<KeepAlive when={true}>
				<Component
					{...props}
				/>
			</KeepAlive>
		);
	};
};
