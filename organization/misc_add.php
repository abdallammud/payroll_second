<!-- Add designation -->
<div class="modal  fade"  data-bs-focus="false" id="add_designation" tabindex="-1" role="dialog" aria-labelledby="add_designationLabel" aria-hidden="true">
    <div class="modal-dialog" role="designation" style="width:500px;">
        <form class="modal-content" id="addDesignationForm" style="border-radius: 14px 14px 0px 0px; margin-top: -15px;">
        	<div class="modal-header">
                <h5 class="modal-title">Add designation</h5>
                <button type="button" class="close modal-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div>
                    <div class="row">
                        <div class="col col-xs-12">
                            <div class="form-group">
                                <label class="label required" for="designationName">Designation Name</label>
                                <input type="text"  class="form-control validate" data-msg="designation name is required" id="designationName" name="designationName">
                                <span class="form-error text-danger">This is error</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary cursor " data-bs-dismiss="modal" aria-label="Close" style="min-width: 100px;">Cancel</button>
                <button type="submit" class="btn btn-primary cursor" style="min-width: 100px;">Save</button>
            </div>
        </form>
    </div>
</div>

<!-- Add porjects -->
<div class="modal  fade"  data-bs-focus="false" id="add_project" tabindex="-1" role="dialog" aria-labelledby="add_projectLabel" aria-hidden="true">
    <div class="modal-dialog" role="project" style="width:500px;">
        <form class="modal-content" id="addProjectForm" style="border-radius: 14px 14px 0px 0px; margin-top: -15px;">
        	<div class="modal-header">
                <h5 class="modal-title">Add project </h5>
                <button type="button" class="close modal-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div>
                    <div class="row">
                        <div class="col col-xs-12">
                            <div class="form-group">
                                <label class="label required" for="projectName">Project Name</label>
                                <input type="text"  class="form-control validate" data-msg="Project name is required" id="projectName" name="projectName">
                                <span class="form-error text-danger">This is error</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col col-xs-12">
                            <div class="form-group">
                                <label class="label required" for="comments">Comments</label>
                                <textarea  class="form-control " id="comments" name="comments"></textarea>
                                <span class="form-error text-danger">This is error</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary cursor " data-bs-dismiss="modal" aria-label="Close" style="min-width: 100px;">Cancel</button>
                <button type="submit" class="btn btn-primary cursor" style="min-width: 100px;">Save</button>
            </div>
        </form>
    </div>
</div>


<!-- Add contract types -->
<div class="modal  fade"  data-bs-focus="false" id="add_contractType" tabindex="-1" role="dialog" aria-labelledby="add_contractTypeLabel" aria-hidden="true">
    <div class="modal-dialog" role="contractType" style="width:500px;">
        <form class="modal-content" id="addContractTypeForm" style="border-radius: 14px 14px 0px 0px; margin-top: -15px;">
            <div class="modal-header">
                <h5 class="modal-title">Add contract type</h5>
                <button type="button" class="close modal-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div>
                    <div class="row">
                        <div class="col col-xs-12">
                            <div class="form-group">
                                <label class="label required" for="contractTypeName">Contract Type </label>
                                <input type="text"  class="form-control validate" data-msg="contractType name is required" id="contractTypeName" name="contractTypeName">
                                <span class="form-error text-danger">This is error</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary cursor " data-bs-dismiss="modal" aria-label="Close" style="min-width: 100px;">Cancel</button>
                <button type="submit" class="btn btn-primary cursor" style="min-width: 100px;">Save</button>
            </div>
        </form>
    </div>
</div>



<!-- Add budget codes -->
<div class="modal  fade"  data-bs-focus="false" id="add_budgetCode" tabindex="-1" role="dialog" aria-labelledby="add_budgetCodeLabel" aria-hidden="true">
    <div class="modal-dialog" role="budgetCode" style="width:500px;">
        <form class="modal-content" id="addBudgetCodeForm" style="border-radius: 14px 14px 0px 0px; margin-top: -15px;">
            <div class="modal-header">
                <h5 class="modal-title">Add budget code </h5>
                <button type="button" class="close modal-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div>
                    <div class="row">
                        <div class="col col-xs-12">
                            <div class="form-group">
                                <label class="label required" for="budgetCode">Budget code</label>
                                <input type="text"  class="form-control validate" data-msg="budgetCode name is required" id="budgetCode" name="budgetCode">
                                <span class="form-error text-danger">This is error</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col col-xs-12">
                            <div class="form-group">
                                <label class="label required" for="comments">Comments</label>
                                <textarea  class="form-control " id="comments" name="comments"></textarea>
                                <span class="form-error text-danger">This is error</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary cursor " data-bs-dismiss="modal" aria-label="Close" style="min-width: 100px;">Cancel</button>
                <button type="submit" class="btn btn-primary cursor" style="min-width: 100px;">Save</button>
            </div>
        </form>
    </div>
</div>