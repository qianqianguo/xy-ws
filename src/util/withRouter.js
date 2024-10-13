import {
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import {withSnackbar} from 'notistack';

export default function withRouter(Component) {
	function ComponentWithRouterProp(props) {
		let location = useLocation();
		let navigate = useNavigate();
		let params = useParams();
		return (
				<Component
					{...props}
					router={{ location, navigate, params }}
				/>
		);
	}
	
	return withSnackbar(ComponentWithRouterProp);
}
//尽量不要改，否则不能传入路由参数
