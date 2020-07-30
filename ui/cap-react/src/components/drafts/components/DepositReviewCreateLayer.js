import React from "react";

import Box from "grommet/components/Box";
import Button from "../../partials/Button";
import Heading from "grommet/components/Heading";
import Layer from "grommet/components/Layer";

import Status from 'grommet/components/icons/Status';

class DepositReviewCreateLayer extends React.Component {
	constructor() {
		super();
		this.state = {
			reviewFormType: null,
			reviewFormBody: null
		};
	}

	toggleAddReview = () => {
		this.setState({
			reviewFormType: null,
			reviewFormBody: null
		})
	}


	_addReview = () => {
		let review = {
			body: this.state.reviewFormBody,
			type: this.state.reviewFormType
		}

		this.props.addReview(review);
	};
	onReviewBodyChange = e => this.setState({ reviewFormBody: e.target.value })

	renderReviewTypeButton(type, title, description) {
		return (
			<Box
				onClick={() => this.setState({ reviewFormType: type })} flex
				colorIndex="light-2" align="start" justify="between" direction="row" wrap={false}>
				<Box pad="small">
					<Heading tag="h4">{title}</Heading>
					<Box pad="small">{description}</Box>
				</Box>
				<Box pad="small"><Status value={this.state.reviewFormType == type ? "ok" : "disabled"} sidze="small" /></Box>
			</Box>
		)
	}

	render() {
		return (
			<Layer flush onClose={this.props.toggleAddReview}>
				<Box pad="small">
					<Heading tag="h4">Add a review</Heading>
					<Box pad={{ between: "small" }}>
						<Box flex direction="row" justify="between" pad={{ between: "small" }}>
							{this.renderReviewTypeButton("approved", "Approve")}
							{this.renderReviewTypeButton("request_changes", "Request Changes")}
							{this.renderReviewTypeButton("declined", "Decline")}
						</Box>
						<Box colorIndex="light-2">
							<textarea placeholder="Leave a comment" onChange={this.onReviewBodyChange} />
						</Box>
						{this.props.error &&
							<Box>
								<span style={{ color: "red" }}>Something went wrong while submitting the review</span>
								{this.props.error.errors.map(e => (
									<span>- {e.field}: {e.message.join(", ")}</span>
								))}
							</Box>}
						<Box flex direction="row" justify="between">
							<Button
								text="Cancel"
								pad={{ horizontal: "small", vertical: "small" }}
								onClick={this.props.toggleAddReview}
							/>
							<Button
								text="Add review"
								primary
								pad={{ horizontal: "small", vertical: "small" }}
								onClick={this._addReview}
							/>
						</Box>
					</Box>
				</Box>
			</Layer>
		)
	}
}

export default DepositReviewCreateLayer;
