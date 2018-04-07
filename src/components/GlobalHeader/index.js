import React, { PureComponent } from 'react';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import {
  Menu,
  Icon,
  Spin,
  Tag,
  Dropdown,
  Avatar,
  Divider,
  Tooltip
} from 'antd';

import { Link } from 'react-router-dom';

import styles from './index.less';

const MenuItem = Menu.Item;

class GlobalHeader extends PureComponent {
  componentWillMount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        // newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold'
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });

    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.dispatchEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  /* eslint-enable*/
  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <MenuItem disabled>
          <Icon type="user" />个人中心
        </MenuItem>
        <MenuItem disabled>
          <Icon type="setting" />设置
        </MenuItem>
        <MenuItem key="triggerError">
          <Icon type="close-circle">触发报错</Icon>
        </MenuItem>
        <Menu.Divider />
        <MenuItem key="logout">
          <Icon type="logout" />退出登录
        </MenuItem>
      </Menu>
    );

    const noticeData = this.getNoticeData();

    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />
        ]}

        <Icon
          className={styles.triggger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />

        <div className={styles.right}>
          <Tooltip title="使用文档">
            <a
              target="_blank"
              href="http://ant.design/docs/getting-started"
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle" />
            </a>
          </Tooltip>

          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  src={currentUser.avatar}
                />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}