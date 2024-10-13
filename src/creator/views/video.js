import * as React from "react";

export default class Video extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			item: props.item,
			paused: true,
		}
		this.video = null;
	}
	componentDidMount() {
		document.addEventListener('webkitfullscreenchange', (evt) => {
			if (this.video && !this.video.webkitDisplayingFullscreen) {
				// 退出全屏
			}
		}, false);
	}
	componentWillUnmount() {}
	
	render() {
		const {item, paused} = this.state;
		return <div
			onClick={()=>{
				// this.video && this.video.webkitRequestFullscreen();
				// setTimeout(()=>{
				// 	this.video && this.video.play();
				// },1000)
				if(paused){
					this.video && this.video.play();
				} else {
					this.video && this.video.pause();
				}
				this.setState({
					paused: !paused,
				})
			}}>
			<video
				autoPlay={false}
				ref={r=>{this.video = r}}
				style={{
					maxWidth: 268,
					minHeight: 268,
					backgroundColor: '#121212',
					borderRadius: 8,
				}}
				src={`${item.img}`}
				width={'100%'}
				height={'100%'}
			/>
		</div>
	}
}
