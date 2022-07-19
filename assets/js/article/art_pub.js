$(function() {
    var layer = layui.layer;
    var form = layui.form
    initCate()
        // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: 'http://www.liulongbin.top:3006/api/getbooks',
            success: function(res) {
                // console.log(res);
                if (res.status !== 200) {
                    return layer.msg('初始化文章分类失败')
                }
                // layer.msg('初始化文章分类成功')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function() {
        $('#coverfile').click()
    })
    $('#coverfile').on('change', function(e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })
    var art_atate = '已发布'
    $('#btnSave2').on('click', function() {
        art_atate = '草稿'
    })
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state', art_atate)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })

    })


    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: 'http://www.liulongbin.top:3007//my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }
})