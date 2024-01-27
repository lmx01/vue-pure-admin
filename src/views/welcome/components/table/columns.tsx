import { tableData } from "../../data";
import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import ThumbUp from "@iconify-icons/ri/thumb-up-line";
import Hearts from "@iconify-icons/ri/hearts-line";
import Empty from "./empty.svg?component";
import { getBookUserList } from "@/api/stu";

export function useColumns() {
  const dataList = ref([]);
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      sortable: true,
      label: "序号",
      prop: "uid"
    },
    {
      sortable: true,
      label: "创建时间",
      prop: "create_time"
    },
    {
      sortable: true,
      label: "帐号",
      prop: "phone_code"
    },
    {
      sortable: true,
      label: "剩余会员天数",
      prop: "left_day"
    },
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 20,
    currentPage: 1,
    layout: "prev, pager, next",
    total: 0,
    align: "center"
  });

  function onCurrentChange(currentPage: number) {
    console.log("onCurrentChange", currentPage);
    loading.value = true;
    getUserListData(currentPage);
  }

  const getUserListData = async (currentPage:number) => {
  try {
    const { data, len } = await getBookUserList(
      {
        user_type: 'book',
        class_id: 0,
        filter: '',
        page: currentPage,
        limit: pagination.pageSize,
        sort: ''
      });
    dataList.value = [...dataList.value,...data];
    pagination.total = len;
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

  onMounted(() => {
    getUserListData(pagination.currentPage);
  });

  return {
    Empty,
    loading,
    columns,
    dataList,
    pagination,
    onCurrentChange
  };
}
