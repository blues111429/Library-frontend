<template>
    <div class="dashboard">
        <h2>图书馆管理面板</h2>

        <!-- 信息统计 -->
        <div class="info-cards">
            <div class="info-card">
                <p style="color: green; font-size: 20px;">{{ borrowdBooks }}</p>
                <h3>在借图书</h3>
            </div>
            <div class="info-card">
                <p style="color: red; font-size: 20px;">{{ overdueBooks }}</p>
                <h3>逾期未还</h3>
            </div>
            <div class="info-card">
                <p style="color: purple; font-size: 20px;">{{ totalBooks }}</p>
                <h3>总藏书量</h3>
            </div>
            <div class="info-card">
                <p style="color: blue; font-size: 20px;">{{ registeredUsers }}</p>
                <h3>注册用户</h3>
            </div>
        </div>

        <!-- 图表展示 -->
        <div class="charts">
            <div class="chart-container">
                <div ref="borrowTrendChart" class="chart" style="height: 300px;"></div>
            </div>
            <!-- <div class="chart-container">
                <div ref="borrowChart" class="chart" style="height: 300px;"></div>
            </div> -->
            <div class="chart-container">
                <div ref="categoryChart" class="chart" style="height: 300px;"></div>
            </div>
        </div>

        
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import api from '../api';  // 这里假设你有一个API模块来获取数据

// 数据
const borrowdBooks = ref(0);
const overdueBooks = ref(0);
const registeredUsers = ref(0);
const totalBooks = ref(0);
//近30天借阅趋势数据
const borrowTrendData = ref({ dates: [], counts: [] });
//分类占比数据
const categories = ref({ name: [], counts: [] });
//表格
const borrowTrendChart = ref(null);
const borrowChart = ref(null);
const categoryChart = ref(null);

// 获取数据
const loadDashboardData = async () => {
    try {
        //获取总览数据
        const overViewResponse = await api.post('/dashboard/overview');
        //获取近30天借阅趋势数据
        const borrowTrendResponse = await api.post('/dashboard/30DaysBorrow');
        //获取借阅(分类)数据
        const borrowResponse = await api.post('/dashboard/borrowCount');
        //获取分类占比数据
        const categoryResponse = await api.post('/dashboard/categoryPercentage');
        
        //总览数据
        borrowdBooks.value = overViewResponse.data.borrowed_book;
        overdueBooks.value = overViewResponse.data.overDue_book;
        totalBooks.value = overViewResponse.data.total_book;
        registeredUsers.value = overViewResponse.data.register_user;
        
        //近30天借阅趋势数据
        const borrowTrend = borrowTrendResponse.data.borrowCounts.map(item => ({
            borrowDate: item.borrowData,
            borrowCount: item.borrowCount
        }));
        borrowTrendData.value.dates = borrowTrend.map(item => item.borrowDate).reverse();  // 反转日期顺序，使最新的日期在右侧
        borrowTrendData.value.counts = borrowTrend.map(item => item.borrowCount).reverse();  // 反转借阅数量顺序，与日期对应
        
        //借阅(分类)数据

        //图书分类占比数据
        const categoriesData = categoryResponse.data.categoryCounts.map(item => ({
            name: item.category,
            counts: item.count,
        }));
        categories.value.name = categoriesData.map(item => item.name);
        categories.value.counts = categoriesData.map(item => item.counts);


    } catch (error) {
        console.error('获取数据失败:', error);
    }
};

const initCharts = () => {
    if (borrowTrendChart.value) {
        const borrowTrendchart = echarts.init(borrowTrendChart.value);
        // 初始化近30天借阅趋势图表
        borrowTrendchart.setOption({
            title: { text: '近30天借阅趋势' },
            tooltip: {
                trigger: 'axis',
                formatter: '{b}<br />借阅数: {c}',  // {b} 是 xAxis 的名称 (日期), {c} 是 yAxis 的数据 (借阅数)
            },
            xAxis: {
                type: 'category',
                data: borrowTrendData.value.dates,
                axisLabel: {
                    rotate: 45, // 如果日期比较长，可以旋转标签
                    interval: 0 // 每个标签都显示
                }
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: borrowTrendData.value.counts,
                    type: 'line',
                    smooth: true, // 平滑曲线
                    animationDuration: 2000, // 动画持续时间
                    itemStyle: {
                        color: '#3eafff' // 设置线条颜色
                    },
                    areaStyle: {} // 添加背景色区域
                }
            ],
            dataZoom: [
                {
                    type: 'inside', // 鼠标滚轮缩放
                    start: 0,
                    end: 100
                },
                {
                    type: 'slider', // 底部的滑动条
                    show: true,  // 显示滑动条
                    xAxisIndex: [0], // 绑定到 x 轴
                    start: 0, // 初始展示开始的百分比
                    end: 100, // 初始展示结束的百分比
                    handleSize: '8%', // 滑动条的控制按钮的大小
                    handleStyle: {
                        color: '#fff',
                        borderColor: '#999',
                        borderWidth: 2,
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                    },
                    textStyle: {
                        fontSize: 12
                    }
                }
            ],
            legend: {
                data: ['借阅数量'],
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '20%',
                containLabel: true
            }
        });
    } else {
        console.error('图表容器引用为空');
    }
    if (categoryChart.value) {
        const categoryChartInstance = echarts.init(categoryChart.value);
        // 初始化图书分类占比图表
        categoryChartInstance.setOption({
            title: { text: '图书分类占比', left: 'center' },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)' // 显示类别名称、数量和百分比
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 10,
                itemGap: 20,
                data: categories.value.name
            },
            series: [
                {
                    name: '分类占比',
                    type: 'pie',
                    radius: '60%',
                    data: categories.value.name.map((name, index) => ({
                        name,
                        value: categories.value.counts[index]
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],
            grip: {
                bottom: '10%',
            }
        });
    } else {
        console.error('图表容器引用为空');
    }
};
// 加载数据和初始化图表
onMounted(() => {
    loadDashboardData().then(initCharts);
});
</script>

<style lang="scss" scoped>
.dashboard {
    padding: 20px;

    h2 {
        font-size: 24px;
        text-align: center;
    }

    .info-cards {
       display: flex;
        gap: 20px;
        justify-content: space-between;
        margin-bottom: 30px;
        
        .info-card {
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            flex: 1;
            text-align: center;

            h3 {
                font-size: 18px;
                margin-bottom: 10px;
            }
        }
    }

    .charts {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;

        .chart-container {
            flex: 1;
            width: 100%;
        }
    }
}
</style>