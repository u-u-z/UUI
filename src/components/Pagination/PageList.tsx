import React, { useMemo } from 'react';
import { range } from 'lodash';
import { Button as UUIButton } from '../Button';
import { UUI } from '../../utils/uui';


export interface BasePageListProps {
  /**
   * Current page
   */
  page: number
  /**
   * Total pages
   */
  totalPage: number
  /**
   * Callback invokes when page changed.
   */
  onPageChange: (page: number) => void
}


export const PageList = UUI.FunctionComponent({
  name: 'PageList',
  nodes: {
    Root: 'div',
    PrevButton: UUIButton,
    PageButton: UUIButton,
    ActivePageButton: UUIButton,
    NextButton: UUIButton,
  }
}, (props: BasePageListProps, nodes) => {
  const { Root, PrevButton, PageButton, ActivePageButton, NextButton } = nodes

  const pageListData = useMemo(() => {
    const maxShowPageNumberLength = 5;
    const pageListData: {
      title: string;
      nonInteractive: boolean;
      selected: boolean;
    }[] = range(1, props.totalPage + 1).map((i) => ({
      title: String(i),
      nonInteractive: false,
      selected: false,
    }));

    const leftHideLength = props.page - 4 < 0 ? 0 : props.page - 4;
    const leftShowLength = (props.page > 4 ? 3 : props.page) - 1;
    const rightShowLength = maxShowPageNumberLength - leftShowLength - 1;
    const rightHideLength = props.totalPage - props.page - rightShowLength - 1;

    if (rightHideLength > 0) {
      pageListData.splice(props.page + rightShowLength, rightHideLength);
      pageListData.splice(pageListData.length - 1, 0, { title: '...', nonInteractive: true, selected: false });
    }
    if (leftHideLength > 0) {
      pageListData.splice(1, leftHideLength);
      pageListData.splice(1, 0, { title: '...', nonInteractive: true, selected: false });
    }
    const selectedPageNumber = pageListData.find(
      (i) => i.title === String(props.page),
    );
    if (selectedPageNumber) {
      if (pageListData.length > 1) {
        selectedPageNumber.selected = true;
      } else {
        selectedPageNumber.nonInteractive = true;
      }
    }

    return pageListData
  }, [props.page, props.totalPage]);

  return (
    <Root className={"u-flex u-flex-row u-mx-2"}>
      <PrevButton
        customize={{
          Root: {
            extendClassName: "u-mr-1"
          }
        }}
        disabled={props.page === 1}
        onClick={() => { if (props.page > 1) props.onPageChange(props.page-1) }}
      >Prev</PrevButton>
      {pageListData.map((item, index) =>
        props.page === Number(item.title) ? (
          <ActivePageButton
            key={`page-item-${index}`}
            customize={{
              Root: {
                extendClassName: "u-mx-1 u-border-blue-500 u-text-blue-500"
              }
            }}
            onClick={() => { if (!item.nonInteractive) props.onPageChange(Number(item.title)) }}
          >{item.title}</ActivePageButton>
        ) : (
          <PageButton
            key={`page-item-${index}`}
            customize={{
              Root: {
                extendClassName: "u-mx-1"
              }
            }}
            onClick={() => { if (!item.nonInteractive) props.onPageChange(Number(item.title)) }}
          >{item.title}</PageButton>
        )
      )}
      <NextButton
        customize={{
          Root: {
            extendClassName: "u-ml-1"
          }
        }}
        disabled={props.page === props.totalPage}
        onClick={() => { if (props.page < props.totalPage) props.onPageChange(props.page+1) }}
      >Next</NextButton>
    </Root>
  )
})

export type PageListProps = Parameters<typeof PageList>[0]