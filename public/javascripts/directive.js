app.directive('commentField', () => {
    return {
        restrict: 'E',
        scope: {
            comment: '=data',
            key: '=key'
        },
        controller: 'commentFieldCtrl',
        template: `
            <div class="comment-content" ng-show="!editActive">
                <div class="btn-group pull-right" role="group" ng-show="userAuth.id == comment.author._id">
                    <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a ng-click="toggle()">Edit</a></li>
                        <li><a ng-click="delComment(key)">Delete</a></li>
                    </ul>
                </div>
                <p>{{comment.detail}}</p>
                <footer class="pull-right">{{comment.author.name}} {{comment.author.lastname}} :: {{comment.date | date: 'medium' }}</footer>
                <div class="clearfix"></div>
            </div>
            <div ng-show="editActive">
                <form name="ecomfrm" ng-submit="editComment()">
                    <div id="errAlert"></div>
                    <div class="form-group">
                        <textarea class="form-control edit-comment" rows="5" name="ecomment" ng-model="comment.detail" placeholder="Comment :" required></textarea>
                    </div>
                    <a class="btn btn-default mg-l-10 pull-right" ng-click="toggle();reset()">Cancel</a>
                    <button type="submit" class="btn btn-default pull-right" ng-disabled="ecomfrm.ecomment.$invalid">Edit</button>
                    <div class="clearfix"></div>
                </form>
            </div>
        `
    }

})
