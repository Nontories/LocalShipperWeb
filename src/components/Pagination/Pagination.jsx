import React, { useState, useEffect, useContext } from 'react'
import './styles.scss'

const Pagination = (props) => {

    const itemsPerPage = props.itemsPerPage
    const positionLength = props.positionLength
    const filterLength = props.filterLength
    const currentPage = props.currentPage
    const setCurrentPage = props.setCurrentPage

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageButtonChange = (type) => {
        if (type) {
            currentPage < Math.ceil(filterLength / itemsPerPage) &&
                setCurrentPage(currentPage + 1);
        } else {
            currentPage > 1 &&
                setCurrentPage(currentPage - 1);
        }
    }

    const renderPaginationButtons = () => {
        const totalPages = Math.ceil(filterLength / itemsPerPage);
        const maxDisplayButtons = 6;

        if (totalPages <= maxDisplayButtons) {
            return Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? 'pagination_button active' : 'pagination_button'}
                >
                    {page}
                </button>
            ));
        }

        const buttons = [];
        const maxVisibleButtons = 3;
        const sideButtonsCount = (maxDisplayButtons - maxVisibleButtons) / 2;

        const startPage = Math.max(1, Math.floor(currentPage - sideButtonsCount));
        const endPage = Math.min(totalPages, Math.ceil(startPage + maxVisibleButtons - 1));

        if (startPage > 1) {
            buttons.push(
                <button key={1} onClick={() => handlePageChange(1)} className="pagination_button">
                    1
                </button>,
                <span key="ellipsis-start">...</span>
            );
        }

        for (let page = startPage; page <= endPage; page++) {
            buttons.push(
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? 'pagination_button active' : 'pagination_button'}
                >
                    {page}
                </button>
            );
        }

        if (endPage < totalPages) {
            buttons.push(
                <span key="ellipsis-end">...</span>,
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="pagination_button"
                >
                    {totalPages}
                </button>
            );
        }

        return buttons;
    };

    return (
        <div
            className="pagination-buttons"
            style={{
                position: positionLength < itemsPerPage ? "absolute" : "unset",
                display: Math.ceil(filterLength / itemsPerPage) > 1 ? "flex" : "none"
            }}
        >
            <div className="back_button" onClick={() => handlePageButtonChange(false)}>{`<`}</div>
            {renderPaginationButtons()}
            <div className="next_button" onClick={() => handlePageButtonChange(true)}>{`>`}</div>
        </div>
    )
}

export default Pagination