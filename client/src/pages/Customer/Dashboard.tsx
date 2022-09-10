import React, {lazy, Suspense, useContext, useState} from 'react'
import {useParams, Link, Route, Outlet,} from "react-router-dom"
import {nonInitialEffect} from "src/reactTools"

import {
  Button,
  Menu,
  Spin,
  Modal,
  TopProgressBar, Animation
} from "components/UI"

import {connect, useDispatch, useSelector} from "react-redux"


import "./Dashboard.scss"
import {RootState} from "src/store";
import {
  BiStar,
  BiUser,
  BsGear, FaAddressBook, FaIcons,
  FaQuestionCircle, FaSignOutAlt, GiCancel,
  GiHelp, GiReturnArrow, GoReport,
  GrOrderedList,
  MdDashboard,
  MdFavorite, MdManageAccounts, MdPayment
} from "react-icons/all";
import Item from "UI/Menu/Item";
import AccountInfo from "pages/Customer/accountInfo/AccountInfo";
import {AppContext, AppContextType, DeviceType} from "store/AppContext";


// const AddressBook = lazy(()=> import("./AddressBook/AddressBook"))
// const Orders = lazy(()=> import("./Orders/Orders"))
// const OrderDetails = lazy(()=> import("./OrderDetails/OrderDetails"))
// const AccountInfo = lazy(()=> import("./accountInfo/AccountInfo"))
// const CustomerDashboard = lazy(()=> import("./CustomerDashboard"))
// const CreateSellerAccount = lazy(()=>import("../SellerHub/createSellerAccount/CreateSellerAccount"))


const {SubMenu} = Menu

const Dashboard = (props) => { 
  let params = useParams() 
  
  // let history = useHistory()
  const dispatch = useDispatch()
  const { authState : {auth} } = useSelector((state: RootState)=>state)
  
  let [collapseIds, setCollapseIds] = React.useState(["1", "1-11"])
  const [isInline, setInline] = useState(false)
  const {contextState, contextDispatch} = useContext<AppContextType>(AppContext)
  
  
  const sidebarData =  [
    {
      id: 0,
      name: "Dashboard",
      icon: <MdDashboard />,
      to: `/customer/${auth ? auth.username : "guest"}`
    },
    {
      label: "Manage My Account",
      name: "My Account",
      id: 1,
      icon: <BiUser />,
      subMenu: [
        {name: "Account Information", to: `/customer/${auth ? auth.username : "guest"}/account-info`,  icon: <MdManageAccounts />, id: "11"},
        {name: "Address Book", to: `/customer/${auth ? auth.username : "guest"}/address-book`, icon: <FaAddressBook />},
        {name: "Payment Option", to: "/dashboard/brands", icon: <MdPayment />},
        {name: "Vouchers", to: "/dashboard/brands", icon: <GoReport />},
      ]
    },
    {
      label: "Manger My orders",
      name: "Orders",
      id: 2,
      icon: <GrOrderedList />,
      subMenu: [
        {name: "My Orders", to: `/customer/${auth ? auth.username : "guest"}/my-orders`, icon: <FaIcons />},
        {name: "My Returns", to: "/dashboard/brands", icon: <GiReturnArrow />},
        {name: "My Cancellations", to: "/dashboard/brands", icon: <GiCancel />},
      ]
    },
    {
      name: "My Reviews",
      to: "",
      id: 3,
      icon: <BiStar />
    },{
      name: "My Wishlist & Followed Stores",
      to: "",
      id: 4,
      icon: <MdFavorite />
    },
    {
      name: "Setting",
      to: "",
      id: 3,
      icon: <BsGear/>
    },
    {
      name: "Policies",
      to: "",
      id: 4,
      icon: <FaQuestionCircle />
    },
    {
      name: "Help",
      to: "",
      id: 5,
      icon: <GiHelp />
    },
    {
      name: "Sign Out",
      to: "",
      id: 6,
      icon: <FaSignOutAlt />
    }
   
  ]
  
  console.log(contextState)
  
  React.useEffect(()=>{
    if(contextState.deviceType === DeviceType.DESKTOP){
      setInline(false)
    } else {
      setInline(true)
    }
  }, [contextState.deviceType])
  
  
  nonInitialEffect(()=>{
    if(!auth){
      // history.push("/auth/login?redirect=dashboard")
    } 
  }, [auth])
  
  
  // function renderCustomerDashboardRoutes(){
  //   return (
  //       <Suspense fallback={<TopProgressBar/>}>
  //         <Switch>
  //
  //           <Route exact={true} path="/customer/:name"
  //             render={props=> <CustomerDashboard
  //             {...props}
  //               username={auth.username}
  //             _id={auth}
  //             /> } />
  //
  //
  //           <Route exact={true} path="/customer/:name/address-book"
  //             render={props=> <AddressBook {...props} _id={auth._id} /> } />
  //
  //           <Route exact={true} path="/customer/:name/create-seller-account"
  //             render={props=> <CreateSellerAccount
  //               {...props}
  //               _id={auth._id}
  //             /> } />
  //
  //
  //           <Route exact={true} path="/customer/:name/my-orders"
  //             render={props=> <Orders {...props} _id={auth._id} /> } />
  //
  //           <Route exact={true} path="/customer/:name/my-orders/details/:orderId"
  //             render={props=> <OrderDetails {...props}  _id={auth._id} /> } />
  //
  //           <Route
  //             exact={true}
  //             path="/customer/:name/account-info"
  //             component={AccountInfo}
  //           />
  //         </Switch>
  //       </Suspense>
  //     )
  //
  // }
  
  
  function renderSidebarMenu(){
    
    function toggleCollapseSubMenu(id){
      if(collapseIds.indexOf(id.toString()) !== -1){
        setCollapseIds([])
      } else{
        setCollapseIds([id.toString()]);
      }
    }
    
    function renderInlineMode(isInline, item){
      
        return isInline && (
            <div className="menu-item_inline relative py-3 px-4 flex flex-col justify-center items-center">
              
              {React.cloneElement(item.icon, { className: "text-xl menu-item-icon"})}
              
              { item.label && (
                  <span
                      className="flex mt-2 gap-0.5 justify-center h-4 items-center"
                      onClick={()=>toggleCollapseSubMenu(item.id)}>
                    <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                    <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                    <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                  </span>
                )
              }
              
              <Animation baseClass="sub_menu_animation" inProp={(collapseIds.includes(item.id.toString()))}>
                  {item.subMenu && item.subMenu.map(item2=>(
                      item2.icon && (
                          <div className="my-3">
                       
                            { React.cloneElement(item2.icon, { className: "text-xl menu-item-icon-sub" }) }
                           
                            { collapseIds.includes(item.id.toString()) && <span
                                className="menu-item-tooltip-sub absolute left-16 whitespace-nowrap bg-neutral-700 px-3 py-2">
                                {item2.name}
                              </span>
                             }
                          </div>
                      )
                  ))}
              </Animation>
              
              <div className="menu-item-tooltip absolute left-16 whitespace-nowrap bg-neutral-700 px-3 py-2">
                <span className="">{item.name}</span>
              </div>
            </div>
        )
    }
    
    return (
      <div className={`sidebar bg-neutral-800 ${isInline ? "inline-mode" : ""}`}>
         { sidebarData.map(data=>(
            <div className="">
              
              <Menu selectedKeys={collapseIds} inline={isInline}>
                
                  <Menu.SubMenu
                    onClickOnItem={toggleCollapseSubMenu} className="pt-1 px-4"
                    key={data.id.toString()}
                    item={data}
                    renderInlineMode={renderInlineMode}
                    label={<h1 className="text-red-500 font-medium mt-2 ml-2">{data.label}</h1>}>
                    
                      <div className="menu-item text-neutral-200">
                          <div className="flex items-center">
                              { data.icon }
                              <span className="ml-2">{data.name}</span>
                          </div>
                      </div>
    
    
                      {data.subMenu  && <div className="bg-neutral-700 px-3 py-2">
                          {data.subMenu.map(s=>(
                              <Menu.Item className=" my-1" key={s.name}>
                                <Link to={s.to} className="flex items-center gap-x-1 text-neutral-200 py-1 menu-item">
                                  {s.icon}
                                  {s.name}
                              </Link>
                            </Menu.Item>
                          ))}
                        </div>
                      }
                    
                  </Menu.SubMenu>
              </Menu>
            </div>
         )) }
      </div>
    )
  }
  
  return (
    <div >
        <div className="h-screen">
        
            {renderSidebarMenu()}
            <br/>
            
          </div>
          <div className="content">
            {/*{renderCustomerDashboardRoutes()}*/}
            <Outlet />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, accusamus atque consequatur distinctio ducimus eligendi eos excepturi illum inventore, laudantium maxime officia omnis perspiciatis, porro quasi quo ratione similique temporibus?
          </div>
        </div>
    )
}



export default Dashboard
