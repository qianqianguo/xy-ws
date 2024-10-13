import React from 'react';

export default class Ellipsis extends React.Component {
	static defaultProps = {
		line: 1,
		ellipsis: '...'
	};
	
	constructor(props) {
		super(props);
		
		let that = this;
		
		this.text = '';
		this.setLineClamp = this.setLineClamp.bind(this);
		this.setLineNormal = this.setLineNormal.bind(this);
		this.clipText = this.clipText.bind(this);
		this.init = this.init.bind(this);
	}
	
	componentDidMount() {
		this.init();
	}
	
	componentDidUpdate() {
		this.init();
	}
	
	init() {
		if ('webkitLineClamp' in document.documentElement.style) {
			this.setLineClamp();
			this.removeTpl();
		}
		else {
			this.setLineNormal();
			this.clipText();
		}
	}
	
	removeTpl() {
		try {
			this.refs.ellip.removeChild(this.refs.getHeight);
		}
		catch (err) {}
	}
	
	setLineNormal() {
		Object.assign(this.refs.ellip.style, {
			'word-break': 'break-all',
			'white-space': 'normal'
		});
	}
	
	setLineClamp() {
		Object.assign(this.refs.ellip.style, {
			'overflow': 'hidden',
			'display': '-webkit-box',
			'webkitBoxOrient': 'vertical',
			'word-break': 'break-all',
			'white-space': 'normal',
			'webkitLineClamp': this.props.line
		});
	}
	
	clipText() {
		let {line, ellipsis, end = () => {}} = this.props;
		let ellip = this.refs.ellip;
		
		if (!this.h) {
			let getHeight = this.refs.getHeight;
			this.h = getHeight.offsetHeight;
			this.removeTpl();
		}
		
		let getCountHeight = () => {
			return parseFloat(getComputedStyle(ellip)['height'], 10);
		};
		
		let init = true;
		
		if (!this.text) {
			this.text = ellip.textContent;
		}
		else {
			ellip.innerHTML = this.text;
		}
		
		let text = this.text;
		let clip = () => {
			let len = 0;
			while (Math.floor(getCountHeight() / this.h) > line) {
				len += 1;
				
				text = text.slice(0, -1);
				ellip.innerHTML = text;
				
				if (!init) {
					ellip.innerHTML += ellipsis;
				}
			}
			
			return len;
		};
		
		if (0 < clip()) {
			ellip.innerHTML += ellipsis;
			init = false;
			clip();
		}
		
		end();
	}
	
	render() {
		let {children, className = '', textStyle} = this.props;
		
		return (
			<div ref="box" className={className}>
				<div ref="ellip" style={textStyle}>
					{children}
					<span ref="getHeight" style={{visibility: 'hidden'}}>{''}</span>
				</div>
			</div>
		);
	}
}
