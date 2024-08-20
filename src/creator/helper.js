import * as React from "react";
import {Container} from "react-bootstrap";

export default class Helper extends React.Component{
	constructor(props) {
		super(props);
		this.state={
		}
	}
	componentDidMount() {}
	componentWillUnmount() {}
	
	render() {
		return <Container
			style={{
				display: 'flex',
				width: '100vm',
				minHeight: '100vh',
				flexDirection: 'column',
			}}>
			<div style={{margin: 12, backgroundColor: '#fff', height: 468}}>
				正在研发设计中
			</div>
		</Container>
	}
}
