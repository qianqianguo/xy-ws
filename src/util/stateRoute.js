import React from "react";

export default function connectRoute(WrappedComponent) {
	return class extends React.Component {
		shouldComponentUpdate(nextProps) {
			return nextProps.src !== this.props.src;
		}
		
		render() {
			return <WrappedComponent {...this.props} />;
		}
	};
}

