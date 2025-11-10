import React from 'react'
import '../componentStyles/NoProducts.css'
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
const NoProducts = ({keyword}) => {
  return (
    <>
    <div className="no-products-content">
      <div className="no-products-icon"><ReportProblemIcon/></div>
      <div className="no-products-title">No Products Found</div>
      <p className="no-products-message">
        {keyword ? `We couldn't find any products matching "${keyword}". Try using different keywords or browse our complete catalog.`:"No products are availabel. Please check back later."}
      </p>
    </div>
    </>
  )
}

export default NoProducts
