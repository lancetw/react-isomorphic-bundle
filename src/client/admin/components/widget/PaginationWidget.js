import React, { PropTypes } from 'react'
import ReactPaginate from 'react-paginate'

if (process.env.BROWSER) {
}

export default class PaginationWidget extends React.Component {

  static propTypes = {
    collect: PropTypes.object.isRequired,
    handlePageClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
  }

  resetSelected () {
    const { offset, limit } = this.props.collect
    if (offset === limit) {
      return 0
    } else {
      return undefined
    }
  }

  render () {
    const { collect } = this.props

    return (
      <ReactPaginate
        previousLabel={<i className="left chevron icon"></i>}
        nextLabel={<i className="right chevron icon"></i>}
        breakLabel={<li className="break">...</li>}
        pageNum={collect.totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        clickCallback={this.props.handlePageClick}
        containerClassName={'ui right floated small pagination menu'}
        subContainerClassName={''}
        forceSelected={::this.resetSelected()}
        activeClassName={"active"} />
    )
  }
}


